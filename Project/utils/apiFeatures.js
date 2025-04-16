class APIFeatures{
    constructor(query, queryString){
        this.query=query;
        this.queryString=queryString;
    }
    filter(){
        const queryObject={...this.queryString};
        const excludedFields=['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field=>delete queryObject[field]);

        let queryStr=JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(lt|gt|lte|gte)\b/g, match => `$${match}`);
        this.query=this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort(){
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.replace(/,/g, ' ');
            this.query=this.query.sort(sortBy);
        }
        return this;
    }
    limitFields(){
        if(this.queryString.fields){
            const fields=this.queryString.fields.replace(/,/g, ' ');
            this.query=this.query.select(fields);
        }else{
            this.query=this.query.select('-__v');
        }
        return this;
    }
    paginate(){
        const page=this.queryString.page * 1 || 1;
        const limit=this.queryString.limit * 1 || 100;
        const skipped=(page-1)*limit;
        this.query=this.query.skip(skipped).limit(limit);
        return this;
    }
}
module.exports = APIFeatures;