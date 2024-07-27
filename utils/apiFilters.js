class Apifilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["sort", "page", "keyword", "fields", "limit"];
    removeFields.forEach((el) => delete queryCopy[el]);

    console.log(queryCopy);
    //advanced filtering
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query.select("-__v");
    }
    return this;
  }
  search(){
   
      const keyword = this.queryStr.keyword ? {
        title:{
          $regex:this.queryStr.keyword,
          $options: "i"
        },
      }
      :{};
      this.query = this.query.find({...keyword})
      return this;

    }
  }

module.exports = Apifilters;
