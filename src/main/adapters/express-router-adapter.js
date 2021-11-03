module.exports = class expressRouterAdapter {
  static adapt(router) {
    return async (request, response) => {
      const httpRequest = {
        body: request.body,
      };
      const httpResponse = await router.route(httpRequest);
      return response.status(httpResponse.statusCode).json(response.body);
    };
  }
};
