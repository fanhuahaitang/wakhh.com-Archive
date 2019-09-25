import mognodb from 'mongodb';

let mongoClient: mognodb.MongoClient | undefined = undefined;

async function createMongoClient() {
  let mongodbIP = '127.0.0.1';
  let mongodbPort = 27017;
  let dbName = 'wakhh.com';
  const uri = `mongodb://${mongodbIP}:${mongodbPort}/${dbName}`;
  let user = '', password = '';
  const options: mognodb.MongoClientOptions = {
    useNewUrlParser: true,
    auth: user ? {
      user,
      password
    } : undefined
  };
  return await mognodb.connect(uri, options)
}

export async function collection(collectionName: string): Promise<mognodb.Collection> {
  if (mongoClient === undefined) {
    mongoClient = await createMongoClient()
  }
  let db = mongoClient.db() // 因为db在前面已经设定好了
  let collection = db.collection(collectionName)
  return collection
}