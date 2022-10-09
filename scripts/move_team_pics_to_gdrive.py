from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
from apiclient.http import MediaFileUpload,MediaIoBaseDownload
from oauth2client.service_account import ServiceAccountCredentials
import io
from os import listdir

# Setup the Drive v3 API
SCOPES = 'https://www.googleapis.com/auth/drive.file'
credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', SCOPES)
drive_service = build('drive', 'v3', http=credentials.authorize(Http()))

def uploadFile(filename, school):
    file_metadata = {
    'name': filename,
    'mimeType': '*/*'
    }
    media = MediaFileUpload('team_pics/' + school + '/' + filename,
                            mimetype='*/*',
                            resumable=False)
    permission = {
        'type': 'anyone',
        'role': 'reader',
    }
    file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    drive_service.permissions().create(fileId=file.get('id'), body=permission).execute()
    print(filename)
    print(f"https://drive.google.com/uc?id={file.get('id')}")

for school in listdir('team_pics'):
    for img in listdir('team_pics/' + school):
        uploadFile(img, school)
