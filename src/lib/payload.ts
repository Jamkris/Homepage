import { getPayload } from 'payload'

import config from '@/payload.config'

export const getPayloadClient = async () => getPayload({ config: await config })
