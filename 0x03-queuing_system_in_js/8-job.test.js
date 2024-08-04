import createPushNotificationsJobs from './8-job.js';
import { createQueue } from 'kue';
import { expect } from 'chai';
import sinon from 'sinon';

describe('createPushNotificationsJobs', function () {
  let queue;
  let createJobStub;

  beforeEach(() => {
    queue = createQueue();

    // Stub the queue.create method to return an object with save and other methods
    createJobStub = sinon.stub(queue, 'create').callsFake((type, data) => {
      return {
        id: Math.floor(Math.random() * 1000),
        type,
        data,
        save: (callback) => { callback(null); return this; }, // Stub save method
        on: function (event, callback) { return this; } // Stub on method
      };
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
  });

});
