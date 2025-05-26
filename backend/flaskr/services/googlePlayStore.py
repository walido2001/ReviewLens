from google_play_scraper import app
from google_play_scraper.exceptions import NotFoundError
from .. import logger

def validate_ID(app_id: str) -> bool:
    try:
        app(app_id, lang='en', country='us')
        logger.info(f"App ID {app_id} is valid")
        return True
    except NotFoundError:
        logger.warning(f"App ID {app_id} not found in Google Play Store")
        return False
    except Exception as e:
        logger.error(f"Error validating app ID {app_id}: {str(e)}")
        return False