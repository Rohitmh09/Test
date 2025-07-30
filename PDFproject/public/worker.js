self.onmessage = function (e)
 {

    const max = e.data;
    const primes = [];

    for(let i = 2; i<=max; i++)
    {
        let isPrime = true;

        for (let index = 2; index < i; index++) {
            
            if (i%index === 0) {
                isPrime = false;
                break;
            }
            
        }
        if (isPrime) {
            primes.push(i);
        }

    }
    self.postMessage(primes);
};
