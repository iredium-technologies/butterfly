import express = require('express')

export interface ResponseInterface {
  render(res: express.Response);
}