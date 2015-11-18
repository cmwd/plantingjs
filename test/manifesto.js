/* global describe, it */

import Manifesto from '../src/js/manifesto';
import manifestoData from '../src/manifesto.json';
import { expect } from 'chai';

describe('Manifesto', () => {
  const manifesto = new Manifesto(manifestoData);

  it('#getProjectionsFor', () => {
    expect(manifesto.getProjectionsFor(0)).to.be.not.empty;
  });

  it('#getMapCoords', () => {
    const mapCoords = manifesto.getMapCoords();
    expect(mapCoords).to.have.property('lng');
    expect(mapCoords).to.have.property('lat');
    expect(mapCoords).to.have.property('zoom');
  });
});
