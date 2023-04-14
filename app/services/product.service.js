const {ObjectId} = require("mongodb");

class ProductService {
    constructor(client) {
        this.product = client.db().collection("products");
    }

    extracConactData(payload) {
        const product = {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            image: payload.image,
        };

        return product;
    }

    async create(payload) {
        const product = this.extracConactData(payload);
        const result = await this.product.findOneAndUpdate(
            product,
            {$set: {}},
            {returnDocument: "after", upsert: true}
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.product.find(filter);
        return cursor.toArray();
    }

    async findbyName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id) {
        return await this.product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extracConactData(payload);
        const result = await this.product.findOneAndUpdate(
            filter,
            {$set: update},
            {returnDocument: "after"}
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.product.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ProductService;