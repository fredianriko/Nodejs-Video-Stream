const express = require("express");
const fs = require("fs");
const app = express();

app.get("/video", (req, res) => {
  const range = req.headers.range;

  //path where the video is stored
  const videoPath = "./Laravel.mp4";

  //size of the file
  const videoSize = fs.statSync(videoPath).size;

  //define the chunk size
  const chunkSize = 1 * 1e6;

  const start = range != undefined ? Number(range.replace(/\D/g, "")) : 0;
  console.log("START", start);
  const end = Math.min(start + chunkSize, videoSize - 1);
  console.log("End", end);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  //partial response status and pass the headers
  res.writeHead(206, headers);

  const stream = fs.createReadStream(videoPath, { start, end });

  //create socket between client and server, to keep alive connection
  stream.pipe(res);
});

app.listen(3001);
