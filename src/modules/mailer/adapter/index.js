import config from '../../../../config';
import { Sendgrid } from './sendgrid';

const instance = {};

export default function factory(adapter) {
  adapter = String(adapter || config.emailServiceAdapter).toLowerCase();

  switch (adapter) {
    case 'sendgrid':
      instance[adapter] = new Sendgrid(config.sendgrid);
      break;
    default:
      throw new Error(`Invalid email adapter: ${adapter}.`);
  }

  return instance[adapter];
}
