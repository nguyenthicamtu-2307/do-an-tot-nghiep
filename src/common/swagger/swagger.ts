import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const title = 'Swagger API';
const description = 'The Swagger API documents';

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 * @param apiVersion {String} v1, v2, etc.
 * @param path {String} user-svc, property-svc, etc.
 */
export const configureSwagger = (
  app: INestApplication,
  apiVersion: string,
  path: string,
  configure: (builder: DocumentBuilder) => void,
) => {
  const builder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(apiVersion)
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'X-API-KEY')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Bearer',
      name: 'access-token',
    });

  configure(builder);

  const openApi = builder.build();
  const document = SwaggerModule.createDocument(app, openApi);

  SwaggerModule.setup(`${path}/swagger`, app, document);
};

export const ApiKeyTag = 'X-API-KEY';
