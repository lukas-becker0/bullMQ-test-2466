const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

const queueName = 'test';

async function start() {
	const queue = new Queue(queueName, {
		connection: {
			host: 'localhost',
			port: 6379,
			// a warning is thrown on redis startup if these aren't added
			enableReadyCheck: false,
			enableOfflineQueue: false,
			maxRetriesPerRequest: null,
		},
	});

	queue.on('error', (error) => {
		console.error(error);
	});

	setInterval(() => {
		queue
			.getWorkers()
			.then((workers) => {
				console.warn(`Number of workers: ${workers.length}`);
			})
			.catch((error) => {
				console.error(error);
			});

		queue
			.getJobCounts()
			.then((numberOfJobs) => {
				console.warn(`Number of jobs: ${JSON.stringify(numberOfJobs)}`);
			})
			.catch((error) => {
				console.error(error);
			});
	}, 10_000);

	const job = await queue.add('__default__', null, {
		jobId: queueName + '-cron-worker-job',
		repeat: {
			every: 3000, // every 3 seconds
		},
		data: {
			foo: 'bar',
		},
	});

	const processFn = async (job) => {
		console.log(`Processing job ${job.id} with data ${job.data}`);
		console.log(`-> ${job.id}`);
		await new Promise((res) => setTimeout(res, 1000));
		console.log(`\t<- ${job.id}`);
	};

	const workerConnection = new Redis({
		host: 'localhost',
		port: 6379,
		// a warning is thrown on redis startup if these aren't added
		enableReadyCheck: false,
		maxRetriesPerRequest: null,
		enableOfflineQueue: true,
	});

	const worker = new Worker(queueName, processFn, {
		connection: workerConnection,
		blockingConnection: true,
	});

	workerConnection.on('error', (err) => {
		console.error(err);
	});

	workerConnection.on('connect', () => {
		console.warn('Worker connected to redis again ...');
		console.warn(`Paused: ${worker.isPaused()}, Running: ${worker.isRunning()}`);
	});

	worker.on('error', (err) => {
		console.error(err);
	});

	worker.on('closed', () => {
		console.warn('Worker closed');
	});

	worker.on('ready', () => {
		console.warn('Worker is ready!');
	});

	worker.on('completed', (job) => {
		console.log(`Job ${job.id} completed`);
	});

	worker.on('failed', (job, err) => {
		console.error(`Job ${job.id} failed with ${err.message}`);
	});
}

start();
