import promo from './schemas/promo'
import review from './schemas/review'
import siteSettings from './schemas/siteSettings'
import goldflow from './schemas/goldflow'

const types = [promo, review, siteSettings, goldflow].filter(Boolean)
export default types
