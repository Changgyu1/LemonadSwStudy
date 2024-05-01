// lemon.js
//npm i oracledb
//node Cafe.js
const fs = require('fs');
const oracledb = requidre('oracledb');

// 정보 수정해서 넣기
const dbConfig = {
  user: 'swith',
  password: 'swith',
  connectString: '116.43.253.210:1521/XE',
};

const jsonData = fs.readFileSync('lemon.json');
const data = JSON.parse(jsonData);

async function tableExists(connection, tableName) {
  const result = await connection.execute(
    `SELECT table_name FROM user_tables WHERE table_name = :tableName`,
    { tableName }
  );

  return result.rows.length > 0;
}

async function insertDataIntoOracle() {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const tableExistsFlag = await tableExists(connection, 'cafes');

    if (!tableExistsFlag) {
      const createTableQuery = `
        CREATE TABLE cafes (
          BPLCNM VARCHAR2(255),
          SITEWHLADDR VARCHAR2(255),
          X VARCHAR2(255),
          Y VARCHAR2(255)
        )`;

      await connection.execute(createTableQuery);
      console.log('테이블 생성!');
    } else {
      console.log('테이블 존재');
    }

    for (const record of data.DATA) {
      const keywords = [
        '까페',
        '카페',
        '커피',
        'coffee',
        '스타벅스',
        '이디야',
        '파스쿠찌',
        '매머드',
        '커피베이',
        '메가',
        '디저트',
        '컴포즈',
        '커피빈',
        '텐퍼센트',
        'banapresso',
        '바나프레소',
        '투썸',
        '빽다방',
        '폴바셋',
        'PAUL',
        '엔제리너스',
        'angel',
        '할리스',
        'HOLLY',
      ];
      //BPLCNM에 위 키워드가 포함된 내용만 넣기
      if (keywords.some((keyword) => record.bplcnm.includes(keyword))) {
        const insertQuery = `
          INSERT INTO cafes (BPLCNM, SITEWHLADDR, X, Y)
          VALUES (:BPLCNM, :SITEWHLADDR, :X, :Y)
        `;

        const bindParams = {
          BPLCNM: record.bplcnm,
          SITEWHLADDR: record.sitewhladdr,
          X: record.x,
          Y: record.y,
        };

        const result = await connection.execute(insertQuery, bindParams, {
          autoCommit: true,
        });
        console.log('데이터 삽입 완료:', result);
      }
    }

    console.log('모든 데이터 삽입이 완료되었습니다.');
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

insertDataIntoOracle();