import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import db from '../../db/db.js';
import * as t from '../../db/schema/schema.js';
import { eq } from 'drizzle-orm';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // eslint-disable-next-line no-undef
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const [user] = await db
      .select()
      .from(t.users)
      .where(eq(t.users.id, jwt_payload.id));
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});
