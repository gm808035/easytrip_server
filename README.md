# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

const https = require('https');

const axios = require('axios').default;

const conf = require('./std/conf');
const log = require('./std/log');
const { Error } = require('./std/errors.js');

const jiraAxiosInstance = axios.create({
    baseURL: conf.main.jiraBaseUrl,
    auth: {
        username: conf.main.jiraUsername,
        password: conf.main.jiraPassword,
    },
    headers: {
        'X-Atlassian-Token': 'no-check'
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    timeout: 5000
});

  async function addCommentToIssue(issueId, comment) {
    try {
      const response = await jiraHttpInstance.post(`/issue/${issueId}/comment`, {
        body: comment,
      });
      return response.status;
    } catch (error) {
      throw new Error('JIRA API. Ошибка при добавлении комментария к заявке');
    }
  }

function getPhotoAddresses(photos, refId) {
    try {
        log.debug(`Функция getPhotoAddresses приняла параметры: photos ${JSON.stringify(photos)}`, refId);

        const path = conf.main.tempPath;
        log.debug(`Путь к папке для сохранения файлов (взятый из конфига conf.main.tempPath): ${path}`, refId);

        let firstPicName = path + '/' + uuidbase62.v4() + photos[0].name;
        let firstPic = fs.readFileSync(photos[0].path, { encoding: 'base64' });
        log.debug(`Имя первого файла: ${firstPicName}.\nРезультат считывания первого файла формата base64 по пути ${photos[0].path}: ${firstPic.slice(0, 15) + '...и т.д. [сокращено для удобства]'}`, refId);

        let secondPicName = path + '/' + uuidbase62.v4() + photos[1].name;
        let secondPic = fs.readFileSync(photos[1].path, { encoding: 'base64' });
        log.debug(`Имя второго файла: ${secondPicName}.\nРезультат считывания второго файла формата base64 по пути ${photos[1].path}: ${secondPic.slice(0, 15) + '...и т.д. [сокращено для удобства]'}`, refId);

        fs.writeFileSync(firstPicName, firstPic, { encoding: 'base64' });
        fs.writeFileSync(secondPicName, secondPic, { encoding: 'base64' });
        log.debug(`Первый файл ${firstPic.slice(0, 15) + '...и т.д. [сокращено для удобства]'} записан по пути ${firstPicName}.\nВторой файл ${secondPic.slice(0, 15) + '...и т.д. [сокращено для удобства]'} записан по пути ${secondPicName}`, refId);

        return [firstPicName, secondPicName];
    } catch (error) {
        throw new Error(error, 'Сохранение фотографий паспорта на локальный диск', refId);
    }
}

async function attachPhotosToIssue(issueKey, photoAddresses, refId) {
    try {
        let formData = new FormData();
        let heads = formData.getHeaders();

        formData.append('file', fs.createReadStream(photoAddresses[0]));
        formData.append('file', fs.createReadStream(photoAddresses[1]));

        const attachmentDownloadUrl = `/issue/${issueKey}/attachments`;

        log.debug(`Multipart formdata, которая будет отправлена в JIRA:\n\n${JSON.stringify(formData)}\n\n`, refId);
        log.debug(`URL для отправки файлов в JIRA: ${attachmentDownloadUrl}`, refId);

        return (await jiraAxiosInstance.post(attachmentDownloadUrl, formData, { headers: heads, timeout: 5000 })).data;
    } catch (error) {
        throw new Error(error, 'Прикрепление фотографий к JIRA issue', refId);
    }
}

function createIssueBody(form, refId) {
    try {
        const projectKey = conf.main.jiraProjectKey;
        const issueTypeId = conf.main.jiraIssueTypeId;
        return {
            "fields": {
                "project": {
                    "key": projectKey
                },
                "summary": form.fullName,
                "issuetype": {
                    "id": issueTypeId
                },
                'customfield_10308': form.idCode,
                'customfield_10315': {
                    value: form.lang
                },
                'customfield_10306':(['Тип заявки: Регистрация клиента в Optima24' + `\n\nФИО: ${form.fullName}` + `\nДата рождения: ${form.birthDate}` +
                    `\n\nИНН: ${form.passportInn}` + `\nСерия и номер: ${form.passportSeriesNumber}` + `\nДата выдачи: ${form.passportIssuedDate}` +
                    `\nДата окончания: ${form.passportExpirationDate}` + `\nОрган выдавший документ: ${form.passportIssuer}` +
                    `\n\nПолучаете ли Push-уведомления: ${form.acceptPushNotifications}` +
                    `\nАккаунт для связи (WhatsApp/Skype): ${form.contact}`]).join() 
            }
        };
    } catch (error) {
        throw new Error(error, 'Формирование issue body для заявки в JIRA', refId);
    }
}
async function createIssueWithAttachments(form, refId) {
    let jiraIssueResponse;
    try {
        let issueBody = createIssueBody(form, refId);
        jiraIssueResponse = (await jiraAxiosInstance.post('/issue', issueBody, { timeout: 5000 })).data;
        log.info(`[SUCCESS] Создание issue в JIRA; [REQUISITE] ${JSON.stringify(jiraIssueResponse)}`, refId);
    } catch (error) {
        throw new Error(error, 'Создание issue в JIRA', refId);
    }

    let photoAddresses;
    try {
        photoAddresses = getPhotoAddresses(form.photos, refId);
        log.debug(`Функцию getPhotoAddresses вернула результат ${JSON.stringify(photoAddresses)}`, refId);
    } catch (error) {
        throw new Error(error, 'Парсинг и сохранение файлов на локальный диск', refId);
    }

    try {
        log.debug(`В функицю attachPhotosToIssue отправлены параметры jiraIssueKey: ${jiraIssueResponse.key} и пути к файлам: ${JSON.stringify(photoAddresses)}`, refId);
        let jiraPhotoResponse = await attachPhotosToIssue(jiraIssueResponse.key, photoAddresses, refId);

        log.info(`SUCCESS - Прикрепление фотографий к JIRA issue; REQUISITE: ${JSON.stringify(jiraPhotoResponse)}`, refId);
        return jiraIssueResponse.key;
    } catch (error) {
        jiraAxiosInstance.delete(`/issue/${issueId}`, { timeout: 5000 }).catch(error => {
            new Error(error, 'Удаление JIRA issue по ID после неудачной попытки прикрепить фотографии', refId).log();
        });
        throw new Error(error, 'Прикрепление фотографий к JIRA issue', refId);
    } finally {
        deletePhotosFromDisk(photoAddresses, refId);
    }
}
module.exports = {
    createIssueWithAttachments
};
