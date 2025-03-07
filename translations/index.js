import auth from './login'
import login from './auth'
import settings from './settings'

const translations = {
  ...auth,
  ...login,
  ...settings
}

export default translations