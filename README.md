# bullMQ-test-2466
Code to reproduce bullMQ issue [2466](https://github.com/taskforcesh/bullmq/issues/2466)

The custom redis.conf file only exists to 
set "appendonly" to "yes" and "maxmemory-policy" to "noeviction"


## How to reproduce the issue:


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


### Sucessfull output:


<img width="873" alt="image" src="https://github.com/lukas-becker0/bullMQ-test-2466/assets/117725216/1eb9fb81-d62f-481c-a761-3bc79f72338c">

### Failed output (Output when the worker stays disconnected from the queue):


<img width="1292" alt="image" src="https://github.com/lukas-becker0/bullMQ-test-2466/assets/117725216/f3d4306e-e1e5-4892-bbd7-419a87c21b38">

