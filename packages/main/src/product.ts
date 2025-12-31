import z from 'zod';

import productJson from '../../../product.json' with { type: 'json' };

const productSchema = z.object({
  name: z.string().nonempty(),
  appId: z.string().nonempty(),
  artifactName: z.string().nonempty(),
  urlProtocol: z.string().nonempty(),
  paths: z.object({
    config: z.string().nonempty(),
    managed: z.object({
      macOS: z.string().nonempty(),
      windows: z.string().nonempty(),
      linux: z.string().nonempty(),
    }),
  }),
  telemetry: z.object({
    key: z.string().nonempty(),
  }),
  catalog: z.object({
    default: z.string().nonempty(),
  }),
  extensions: z.object({
    remote: z.array(
      z.object({
        name: z.string().nonempty(),
        oci: z.string().nonempty(),
      }),
    ),
  }),
});

export const product = productSchema.parse(productJson);
