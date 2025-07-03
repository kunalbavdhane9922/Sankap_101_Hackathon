import os
import time
import json
from datetime import datetime
import yagmail
import schedule

# --- CONFIG ---
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'kunalbavdhane99@gmail.com')
SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD', 'uefg iety lgcj sgvp')
EMAILS_FILE = os.path.join(os.path.dirname(__file__), 'backend', 'scheduledEmails.json')

# --- Email Sending Logic ---
def send_email(entry):
    receiver = entry['email']
    if entry.get('type') == 'confirmation':
        subject = 'Your post is scheduled!'
        body = f"""
Hi {receiver},

Your post for {entry.get('platform', 'Social Media')} is scheduled for {entry.get('originalTime', entry.get('time'))}.

Content:
{entry.get('content', '')}

— Social Media Dashboard
"""
    else:
        subject = 'Your scheduled post is Scheduled!'
        body = f"""
Hi {receiver},

This is your POST "{entry.get('platform', 'Social Media')}" is Scheduled.

Content:
{entry.get('content', '')}

— Social Media Dashboard
"""
    try:
        yag = yagmail.SMTP(SENDER_EMAIL, SENDER_PASSWORD)
        yag.send(to=receiver, subject=subject, contents=body)
        print(f"[SENT] {entry.get('type','reminder').capitalize()} email sent to {receiver} for post at {entry.get('originalTime', entry.get('time'))}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send email to {receiver}: {e}")
        return False

def check_and_send():
    try:
        with open(EMAILS_FILE, 'r') as f:
            emails = json.load(f)
    except Exception:
        emails = []
    now = datetime.now().isoformat(timespec='minutes')
    changed = False
    for entry in emails:
        if not entry.get('sent') and entry['time'][:16] <= now[:16]:
            if send_email(entry):
                entry['sent'] = True
                changed = True
                with open(EMAILS_FILE, 'w') as f:
                    json.dump(emails, f, indent=2)
    if changed:
        with open(EMAILS_FILE, 'w') as f:
            json.dump(emails, f, indent=2)

if __name__ == '__main__':
    print('Notifier started. Monitoring scheduled emails...')
    schedule.every(1).minutes.do(check_and_send)
    while True:
        schedule.run_pending()
        time.sleep(5) 