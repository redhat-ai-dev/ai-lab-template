import { AITemplate } from "../suite/types";
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path'

export const loadDefaultModel = (template: AITemplate, modelServer: string): string => {
  const yaml = readFileSync(join(__dirname, '..', '..', 'templates', template, 'template.yaml'), 'utf8');
  const templateObject = load(yaml) as { [key: string]: any };

  // Find parameters of the first step > model servers
  const modelServers = templateObject.spec.parameters[0].dependencies.modelServer.oneOf as { [key: string]: any }[];
  
  // Filter by the chosen model server
  const server = modelServers.find((value) => {
    return value.properties.modelServer.const === modelServer
  });

  // Get the default model for given model server
  return server!.properties.modelNameDeployed.default;
}
