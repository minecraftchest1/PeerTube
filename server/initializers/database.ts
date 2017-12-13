import { Sequelize as SequelizeTypescript } from 'sequelize-typescript'
import { isTestInstance } from '../helpers/core-utils'
import { logger } from '../helpers/logger'

import { AccountModel } from '../models/account/account'
import { AccountFollowModel } from '../models/account/account-follow'
import { AccountVideoRateModel } from '../models/account/account-video-rate'
import { UserModel } from '../models/account/user'
import { ApplicationModel } from '../models/application/application'
import { AvatarModel } from '../models/avatar/avatar'
import { JobModel } from '../models/job/job'
import { OAuthClientModel } from '../models/oauth/oauth-client'
import { OAuthTokenModel } from '../models/oauth/oauth-token'
import { ServerModel } from '../models/server/server'
import { TagModel } from '../models/video/tag'
import { VideoModel } from '../models/video/video'
import { VideoAbuseModel } from '../models/video/video-abuse'
import { VideoBlacklistModel } from '../models/video/video-blacklist'
import { VideoChannelModel } from '../models/video/video-channel'
import { VideoChannelShareModel } from '../models/video/video-channel-share'
import { VideoFileModel } from '../models/video/video-file'
import { VideoShareModel } from '../models/video/video-share'
import { VideoTagModel } from '../models/video/video-tag'
import { CONFIG } from './constants'

require('pg').defaults.parseInt8 = true // Avoid BIGINT to be converted to string

const dbname = CONFIG.DATABASE.DBNAME
const username = CONFIG.DATABASE.USERNAME
const password = CONFIG.DATABASE.PASSWORD

const sequelizeTypescript = new SequelizeTypescript({
  database: dbname,
  dialect: 'postgres',
  username,
  password,
  modelPaths: [__dirname + '/models'],
  benchmark: isTestInstance(),
  isolationLevel: SequelizeTypescript.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  operatorsAliases: false,
  logging: (message: string, benchmark: number) => {
    if (process.env.NODE_DB_LOG === 'false') return

    let newMessage = message
    if (isTestInstance() === true && benchmark !== undefined) {
      newMessage += ' | ' + benchmark + 'ms'
    }

    logger.debug(newMessage)
  }
})

async function initDatabaseModels (silent: boolean) {
  sequelizeTypescript.addModels([
    ApplicationModel,
    AvatarModel,
    AccountModel,
    JobModel,
    OAuthClientModel,
    OAuthTokenModel,
    ServerModel,
    TagModel,
    AccountVideoRateModel,
    AccountFollowModel,
    UserModel,
    VideoAbuseModel,
    VideoChannelModel,
    VideoChannelShareModel,
    VideoShareModel,
    VideoFileModel,
    VideoBlacklistModel,
    VideoTagModel,
    VideoModel
  ])

  if (!silent) logger.info('Database %s is ready.', dbname)

  return
}

// ---------------------------------------------------------------------------

export {
  initDatabaseModels,
  sequelizeTypescript
}
