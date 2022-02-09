import { ListItem } from '../types';
import { sortByDate } from ".";
import { parseItem } from '../service/api';

const list = [
    {
        "enabled": true,
        "expiresAt": 1646092800000,
        "createdAt": 1615230817874,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 1,
        "id": "62cd2320-8042-11eb-8709-2913ee8f726d",
        "name": "Qnext Options"
    },
    {
        "enabled": true,
        "expiresAt": 1660780800000,
        "createdAt": 1629027786993,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 6,
        "id": "57288340-dbb0-11e8-8adb-f9e32b86d5e6",
        "name": "Ford Transit SBA"
    },
    {
        "enabled": true,
        "expiresAt": 1654214400000,
        "createdAt": 1622820703546,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 5,
        "id": "defa7af0-dbae-11e8-8adb-f9e32b86d5e6",
        "name": "Ford Transit Check"
    },
    {
        "enabled": true,
        "expiresAt": 1652227200000,
        "createdAt": 1620981832837,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 4,
        "id": "0a7abb70-dbb1-11e8-8adb-f9e32b86d5e6",
        "name": "Ford Transit Kasko"
    },
    {
        "enabled": true,
        "expiresAt": 1645142400000,
        "createdAt": 1615230610441,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 7,
        "id": "5f834460-dbb2-11e8-8adb-f9e32b86d5e6",
        "name": "BACB 6000"
    },
    {
        "enabled": true,
        "expiresAt": 1645574400000,
        "createdAt": 1614107704917,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 3,
        "id": "6d080e40-2df6-11e9-87b0-7732108ff877",
        "name": "Ford Focus Vignette"
    },
    {
        "enabled": true,
        "expiresAt": 1671667200000,
        "createdAt": 1640463424069,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 4,
        "id": "6e277370-db61-11e8-9a16-ad6832cf4c38",
        "name": "Mladost Insurance"
    },
    {
        "enabled": true,
        "expiresAt": 1665014400000,
        "createdAt": 1633432708393,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 5,
        "id": "17280710-db61-11e8-9a16-ad6832cf4c38",
        "name": "Ford Focus Insurance"
    },
    {
        "enabled": true,
        "expiresAt": 1665014400000,
        "createdAt": 1633502855134,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 5,
        "id": "3a94efb0-db61-11e8-9a16-ad6832cf4c38",
        "name": "Ford Focus Check"
    },
    {
        "enabled": true,
        "expiresAt": 1675555200000,
        "createdAt": 1612548945625,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 4,
        "id": "2a5fbc90-67de-11eb-8916-651f7a313d27",
        "name": "BACB 4500"
    },
    {
        "enabled": true,
        "expiresAt": "2022-02-01T09:34:30.380Z",
        "createdAt": 1643708081734,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 3,
        "id": "a925a980-82d7-11ec-8d0e-1f6470dff626",
        "name": "wwwww"
    },
    {
        "enabled": true,
        "expiresAt": 1651536000000,
        "createdAt": 1619885665255,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 4,
        "id": "c104cd70-dbae-11e8-8adb-f9e32b86d5e6",
        "name": "Ford Transit Insurance"
    },
    {
        "enabled": true,
        "expiresAt": 1649030400000,
        "createdAt": 1615230574405,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 7,
        "id": "a76ffea0-5e54-11ea-8161-4f9d0ea0677d",
        "name": "POSTBANK 5000"
    },
    {
        "enabled": true,
        "expiresAt": 1671667200000,
        "createdAt": 1640463441249,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 4,
        "id": "869480b0-db61-11e8-9a16-ad6832cf4c38",
        "name": "Cherniovo Insurance"
    },
    {
        "enabled": true,
        "expiresAt": 1674345600000,
        "createdAt": 1642772153969,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 5,
        "id": "4e404aa0-271a-11e9-a766-5784c12de088",
        "name": "Wedding Day"
    },
    {
        "enabled": true,
        "expiresAt": 1647129600000,
        "createdAt": 1615792867339,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 3,
        "id": "4039e600-271a-11e9-a766-5784c12de088",
        "name": "Ford Fransit Vignette"
    },
    {
        "enabled": true,
        "expiresAt": 1646611200000,
        "createdAt": 1615230631433,
        "user": "874d1d50-d927-11e8-a63b-9bd38c38fe40",
        "daysBefore": 7,
        "id": "60ac85f0-db61-11e8-9a16-ad6832cf4c38",
        "name": "BACB 1000"
    }
].map(parseItem) as ListItem[];


const sortedList = list.sort(sortByDate);

console.log(sortedList.map(item => item.expiresAt));
