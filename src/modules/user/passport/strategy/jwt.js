import _ from 'lodash';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User, UserStatus } from '../../model';
import { jwt as jwtOptions } from '../../../../../config';

const jwtParams = {
  secretOrKey: jwtOptions.secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
};
export default new JwtStrategy(jwtParams, async(jwtPayload, done) => {
  const user = await User.findOne({ where: { user_id: jwtPayload.user_id } });
  if (user) {
    if (_.includes([UserStatus.ACTIVE], user.get('status'))) {
      return done(null, user.toJSON());
    }
  }
  return done(null, false);
});
