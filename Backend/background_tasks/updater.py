from apscheduler.schedulers.background import BackgroundScheduler
from .expired_veryfication import delete_expired_user_verifications

# Run the method every hour
def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_expired_user_verifications, 'interval', hours=1)
    scheduler.start()