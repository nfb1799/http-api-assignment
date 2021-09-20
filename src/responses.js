const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const respondJSON = (request, response, status, object) => {
  respond(request, response, status, JSON.stringify(object), 'application/json');
};

const respondXML = (request, response, status, content) => {
  respond(request, response, status, content, 'text/xml');
};

const success = (request, response, acceptedTypes) => {
  const content = {
    message: 'This is a successful response',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = `<response><message>${content}</message></response>`;
    return respondXML(request, response, 200, responseXML);
  }

  return respondJSON(request, response, 200, content);
};

const badRequest = (request, response, acceptedTypes, params) => {
  let status = 200;
  const content = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    content.message = 'Missing valid query paramater set to true';
    content.id = 'Bad Request';

    status = 400;
  }

  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = `<response><message>${content}</message></response>`;

    if (status === 400) {
      responseXML = `<response><message>${content.message}</message>
        <id>${content.id}</id></response>`;
    }

    return respondXML(request, response, status, responseXML);
  }

  return respondJSON(request, response, status, content);
};

const unauthorized = (request, response, acceptedTypes, params) => {
  let status = 200;
  const content = {
    message: 'This request has the required paramaters',
  };

  if (params.loggedIn !== 'yes') {
    content.message = 'Missing loggedIn query parameter set to yes';
    content.id = 'Unauthorized';

    status = 401;
  }

  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = `<response><message>${content}</message></response>`;

    if (status === 401) {
      responseXML = `<response><message>${content.message}</message>
        <id>${content.id}</id></response>`;
    }

    return respondXML(request, response, status, responseXML);
  }

  return respondJSON(request, response, status, content);
};

const forbidden = (request, response, acceptedTypes) => {
  const content = {
    message: 'You do not have access to this content',
    id: 'Forbidden',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = `<response><message>${content.message}</message>
      <id>${content.id}</id></response>`;
    return respondXML(request, response, 403, responseXML);
  }

  return respondJSON(request, response, 403, content);
};

const internal = (request, response, acceptedTypes) => {
  const content = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'Internal',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = `<response><message>${content.message}</message>
      <id>${content.id}</id></response>`;
    return respondXML(request, response, 500, responseXML);
  }

  return respondJSON(request, response, 500, content);
};

const notImplemented = (request, response, acceptedTypes) => {
  const content = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'Not Implemented',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = `<response><message>${content.message}</message>
      <id>${content.id}</id></response>`;
    return respondXML(request, response, 501, responseXML);
  }

  return respondJSON(request, response, 501, content);
};

const notFound = (request, response, acceptedTypes) => {
  const content = {
    message: 'The page you are looking for was not found.',
    id: 'Not Found',
  };

  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = `<response><message>${content.message}</message>
      <id>${content.id}</id></response>`;

    return respondXML(request, response, 404, responseXML);
  }

  return respondJSON(request, response, 404, content);
};

module.exports = {
  success,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
};
