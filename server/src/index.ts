import fastify from 'fastify';
import cors from '@fastify/cors';


import getCharts from './tscreator/tscreator'

const server = fastify();

import chart_information from './chart_information.json' assert { type: "json" };


for (let x in chart_information) {
  console.log(x + chart_information as string);
}
console.log(chart_information.charts);
console.log('length of json object = ' + chart_information);

console.log('here');
console.log('here');

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

server.post('/charts', (request: any, reply: any) => {
  //reply.send(request.body.imgSrc);
  console.log(chart_information);
  //reply.send(chart_information);
  reply.send(chart_information);
})

server.post('/getchart', (request: any, reply: any) => {
  console.log('here')
  const title = request.title
  getCharts(title);

})

const start = async () => {
  try {
    await server.listen({ port: 3000 })
    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port
    console.log(address + ' ' + port);
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
