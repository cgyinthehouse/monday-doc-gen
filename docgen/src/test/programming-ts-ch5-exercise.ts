class RequestBuilder {
  protected data: object | null = null;
  protected method: "get" | "post" | null = null;
  protected url: string | null = null;

  setMethod(method: "get" | "post"): RequestBuilderWithMethod {
    return new RequestBuilderWithMethod().setMethod(method).setData(this.data);
  }
  setData(data: object | null): this {
    this.data = data;
    return this;
  }
}

class RequestBuilderWithMethod extends RequestBuilder {
  setMethod(method: "get" | "post" | null): this {
    this.method = method;
    return this;
  }
  setURL(url: string): RequestBuilderWithMethodAndURL {
    return new RequestBuilderWithMethodAndURL()
      .setMethod(this.method)
      .setData(this.data)
      .setURL(url);
  }
}

class RequestBuilderWithMethodAndURL extends RequestBuilderWithMethod {
  setURL(url: string): this {
    this.url = url;
    return this;
  }
  send() {
    // ...
  }
}

new RequestBuilder().setMethod("get").setData({}).setURL("foo.com").send();
