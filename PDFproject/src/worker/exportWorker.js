self.onmessage = function (e)
 {

    const {m1,m2} = e.data;

    console.log(`${m1} --------- ${m2}`);
    
    self.postMessage(`Data get == ${m1} --------- ${m2}`);
};
