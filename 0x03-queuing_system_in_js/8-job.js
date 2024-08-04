import { createQueue } from 'kue';

const queue = createQueue();

function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  };

  jobs.forEach(jobData => {
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (!err) {
          console.log(`Notification job created: ${job.id}`);
        }
      })
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    })
      .on('fail', (err) => {
        console.log(`Notification job ${job.id} failed: ${err}`)
      })
      .on('progress', (progress) => {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      });
  });
}

module.exports = createPushNotificationsJobs;
