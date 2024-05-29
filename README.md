# bullMQ-test-2466
Code to reproduce bullMQ issue [2466](https://github.com/taskforcesh/bullmq/issues/2466)

`npm run start-redis`
`npm run start`

Wait a few seconds ~3-5 or more if you want.

`npm run stop-redis`

Wait a few seconds ~3-5 or more if you want.


`npm run start-redis`

See whether the worker starts processing the repeated job again.
And whether the queues worker count goes up to 1 again or gets stuck at 0.



Repeat redis start/stop circle a few times to make sure it works, sometimes the 
worker does connect correctly.