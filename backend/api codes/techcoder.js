const axios = require('axios');
let data = JSON.stringify({
  "size": "16_9",
  "model": "techcoderai",
  "prompt": "water drop"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://fluxai-imagegenapi.techzone.workers.dev/generate-image',
  headers: { 
    'accept': '*/*', 
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7', 
    'content-type': 'application/json', 
    'origin': 'https://fluxvip.netlify.app', 
    'priority': 'u=1, i', 
    'referer': 'https://fluxvip.netlify.app/', 
    'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'cross-site', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
