import { Collection, ObjectId } from "mongodb";
import { collection } from './mongodb';
import { Rule } from '../crawler';
import request from 'request-promise-native';

let collectionName = 'targetCrawler'

interface GenerateRequestFunction {
  (keyword: string, urlencode: (url: string) => string): string | any
}

type GenerateRequestCode = string | GenerateRequestFunction

interface ProcessResponseFunction {
  (response: any): any
}

type ProcessResponseCode = string | ProcessResponseFunction

interface WebpageCrawler {
  readonly type: 'webpage'
  name: string
  description: string
  domain: string
  request: GenerateRequestCode,
  rule: Rule
}

interface APICrawler {
  readonly type: 'api'
  name: string
  description: string
  domain: string
  request: GenerateRequestCode,
  callback: ProcessResponseCode
}

type TargerCrawler = {
  _id?: ObjectId;
  id?: string;
} & (WebpageCrawler | APICrawler)

let targetCrawlersCollcection: Collection<TargerCrawler>

// 查询单个爬虫
export async function getCrawler(id: string): Promise<(WebpageCrawler | APICrawler)> {
  if (targetCrawlersCollcection === undefined) {
    targetCrawlersCollcection = await collection(collectionName)
  }
  let crawler = await targetCrawlersCollcection.findOne({
    _id: new ObjectId(id)
  })
  if (crawler) {
    crawler.id = crawler._id.toHexString();
    delete crawler._id;
  }
  return crawler;
}

// 批量查询爬虫
export async function getCrawlers(skip = 0, limit = 0) {
  if (targetCrawlersCollcection === undefined) {
    targetCrawlersCollcection = await collection(collectionName)
  }
  let crawlers = await targetCrawlersCollcection.find({}, {
    skip,
    limit
  }).toArray();
  if (crawlers && crawlers.length) {
    crawlers = crawlers.map(crawler => {
      crawler.id = crawler._id.toHexString();
      delete crawler._id;
      return crawler;
    })
  }
  return crawlers;
}

// 添加爬虫
export async function createNewCrawler(crawler: WebpageCrawler | APICrawler) {
  if (targetCrawlersCollcection === undefined) {
    targetCrawlersCollcection = await collection(collectionName)
  }
  if (crawler.request && typeof crawler.request !== 'string') {
    crawler.request = crawler.request.toString();
  }
  if (crawler.type === 'api' && crawler.callback && typeof crawler.callback !== 'string') {
    crawler.callback = crawler.callback.toString();
  }
  return await targetCrawlersCollcection.insertOne(crawler);
}

// 修改爬虫
export async function updateCrawler(id: string, crawler: WebpageCrawler | APICrawler) {
  if (targetCrawlersCollcection === undefined) {
    targetCrawlersCollcection = await collection(collectionName)
  }
  if (crawler.request && typeof crawler.request !== 'string') {
    crawler.request = crawler.request.toString();
  }
  if (crawler.type === 'api' && crawler.callback && typeof crawler.callback !== 'string') {
    crawler.callback = crawler.callback.toString();
  }
  return await targetCrawlersCollcection.updateOne({
    _id: new ObjectId(id)
  }, {
    $set: crawler
  })
}