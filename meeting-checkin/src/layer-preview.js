
import React from 'react';

import {connect} from 'react-redux';

import DownloadIcon from 'react-icons/lib/md/file-download';
import MapIcon from 'react-icons/lib/md/map';
import UserIcon from 'react-icons/lib/fa/user';

import fetch from 'isomorphic-fetch';

import {jsonEquals} from '@boundlessgeo/sdk/util';
import {getActionsFromResult} from './actions';

import LayersIcon from '../../components/layers-icon';

function makeLayerLink(name, title, url) {
  return (
    <a
      key={name}
      target="_blank"
      title={title}
      href={url}
    >
      {name}
    </a>
  );
}

function getTypeName(layer) {
  let typename = layer.typename;
  if (typename.indexOf(':') < 0) {
    typename = layer.workspace + '/' + typename;
  } else {
    typename = typename.replace(':', '/');
  }
  return typename;
}

class LayerPreview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      layer: null,
      legendActions: null,
    };
  }


  getLegend(layer) {
    // Legend URL construction from Exchange.

    // port from the layer preview from Exchange,

    const geoserver = this.props.config.geoserver_url;
    const token = this.props.config.access_token;
    const typename = getTypeName(layer);
    const legend_url = `${geoserver}/${typename}/ows?request=GetLegendGraphic&service=WMS&version=1.3.0&format=image/png&LAYER=${layer.typename}&access_token=${token}`;

    return (<img alt={`${layer.title} legend`} src={legend_url}/>);
  }

  getLinks(searchResult, layer) {
    const links = [];
    const geoserver = this.props.config.geoserver_url;

    if (searchResult.geogig_link) {
      links.push(makeLayerLink('GeoGig', 'GeoGig', searchResult.geogig_link));
    }

    const title = 'Open in new Window';

    const typename = getTypeName(layer);

    if (searchResult.subtype === 'vector' || searchResult.subtype === 'raster') {
      const wms_url = `${geoserver}/${typename}/ows?request=GetCapabilities&service=WMS&version=1.3.0`;
      links.push(makeLayerLink('WMS', title, wms_url));
    }

    if (searchResult.subtype === 'vector') {
      const wfs_url = `${geoserver}/${typename}/ows?request=GetCapabilities&service=WFS&version=1.1.0`;
      links.push(makeLayerLink('WFS', title, wfs_url));
    }

    if (searchResult.subtype === 'raster') {
      const wcs_url = `${geoserver}/${typename}/ows?request=GetCapabilities&service=WCS&version=2.0.1`;
      links.push(makeLayerLink('WCS', title, wcs_url));
    }

    return links;
  }

  getLayerInfo(apiId) {
    fetch(`${this.props.config.api_url}/layers/${apiId}/`, {
      credentials: 'same-origin'
    })
      .then(r => r.json())
      .then((layer) => {
        this.setState({layer: layer});
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // quick null check
    if (this.props.search.activeLayer !== null && nextProps.search.activeLayer === null) {
      this.setState({layer: null});
      return true;
    }

    // deeper check for when the content of the layers differ,
    if (!jsonEquals(this.props.search.activeLayer, nextProps.search.activeLayer)) {
      this.getLayerInfo(nextProps.search.activeLayer.id);
      return true;
    }

    return (!jsonEquals(this.state, nextState));
  }

  /** Assemble the translation between a search result
   *  and what is needed for the map. Then dispatch the appropriate
   *  actions to add the result to the map.
   *
   *  @param {object} result - result from a search.
   *
   */
  addToMap(result) {
    // get the actions for a particular result and then replay
    //  them in order to add the layer to the map.
    getActionsFromResult(this.props.map.metadata, this.props.config, result, this.state.layer.workspace).then((actions) => {
      for (let i = 0, ii = actions.length; i < ii; i++) {
        this.props.dispatch(actions[i]);
      }
    });
  }

  updateLayerInfo(state, props) {
    if (state.layer === null && props.search.activeLayer !== null) {
      this.getLayerInfo(props.search.activeLayer.id);
    }
  }

  componentWillMount() {
    this.updateLayerInfo(this.state, this.props);
  }

  componentWillUpdate(nextProps, nextState) {
    this.updateLayerInfo(nextState, nextProps);
  }

  render() {
    const layer = this.state.layer;

    // hide rendering for when no layer is selected.
    if (layer === null || this.props.search.activeLayer === null) {
      return false;
    }

    let abstract_text = layer.abstract;
    const max_abstract_length = 100;
    if (layer.abstract && layer.abstract.length > max_abstract_length) {
      abstract_text = layer.abstract.substring(0, max_abstract_length) + '...';
    }

    return (
      <aside className="bottom layer-info">
        <div className="thumbnail-display">
          <div className="thumbnail">
            <img alt={`${layer.title} thumbnail`} src={layer.thumbnail_url} />
          </div>
          <div className="subtitle">
            <div className="thumbnail-category">
              <LayersIcon /> { layer.category ? layer.category.gn_description : '' }
            </div>
            <div className="maps-count">
              <MapIcon />
            </div>
          </div>
        </div>

        <div className="layer-detail">
          <div className="layer-detail-header">
            <div className="detail-header">
              <div className="detail-layer-title">{ layer.title }</div>
              <div className="layer-controls">
                <DownloadIcon />

                <a onClick={() => {
                  this.addToMap(this.props.search.activeLayer);
                }}>
                  <MapIcon />
                </a>
              </div>
            </div>

            <div className="detail-subheader">
              <UserIcon /> { layer.owner.username } on { layer.date }
            </div>
          </div>


          <div className="layer-details">
            <div className="detail-display">
              <h5>Abstract</h5>
              { abstract_text }

              <h5>Source</h5>
              { layer.typename }

              <h5>Classification and releasability</h5>
              { layer.is_published ? 'Published' : 'Unpublished' }
            </div>

            <div className="details-legend">
              <h5>Legend</h5>
              { this.getLegend(layer) }
            </div>
          </div>

          <div className="layer-links">
            { this.getLinks(this.props.search.activeLayer, layer) }
          </div>
        </div>
      </aside>
    );
  }
}

function mapFn(state) {
  return {
    search: state.search,
    map: state.map,
    config: state.config,
  };
}

export default connect(mapFn)(LayerPreview);
