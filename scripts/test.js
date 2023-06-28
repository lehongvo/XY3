const test = () => {
    try {
        let index = 10;
        for(let i = 0; i < 20; i++) {
            if(i == index) {
                continue;
            }
            console.log(i);
        }
    } catch (error) {
        console.log(error);
    }
}

test();