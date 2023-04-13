const {ObjectId} = require("mongodb");

class NewsService {
    constructor(client) {
        this.news = client.db().collection("news");
    }

    extracNewsData(payload) {
        const news = {
            title: payload.title,
            description: payload.description,
            image: payload.imageUrl,
        };

        return news;
    }

    async create(payload) {
        const news = this.extracNewsData(payload);
        const result = await this.news.findOneAndUpdate(
            news,
            {$set: {}},
            {returnDocument: "after", upsert: true}
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.news.find(filter);
        return cursor.toArray();
    }

    async findbyName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id) {
        return await this.news.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extracConactData(payload);
        const result = await this.news.findOneAndUpdate(
            filter,
            {$set: update},
            {returnDocument: "after"}
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.news.fineOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.news.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = NewsService;