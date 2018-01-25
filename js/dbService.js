/**
 * AppDb класс для работы с indexedDb приложения
 *
 * @param {string} dbName имя indexedDb базы данных
 * @param {string} dbName имя indexedDb базы данных
 * @this {AppDb}
 * @constructor
 */


class AppDb{
    constructor(dbName,objStoreName){
        this.dbname=dbName;
        this.objStoreName=objStoreName;
        this.dbPromise = idb.open(this.dbname, 1, upgradeDB => {
            upgradeDB.createObjectStore(this.objStoreName);
        });
    }
    /**
     * setDataToDb добавляет данные в базу
     *
     * @param {string} index индекс
     * @param {object} data  данные
     */
    setDataToDb(index,data){
        this.dbPromise.then((db)=>{
            var tx = db.transaction(this.objStoreName, 'readwrite');
            var keyValStore = tx.objectStore(this.objStoreName);
            keyValStore.put(data, index);
            return tx.complete;
        }).then(function() {
            console.log('Added data:',index);
        });
    }
    /**
     * getDataFromDb получает данные из базы
     *
     * @param {string} index индекс
     * @return {promise} Возвращает промис для получения данных.
     */
    getDataFromDb(index){
      return  this.dbPromise
            .then((db)=> {
                var tx = db.transaction(this.objStoreName);
                var keyValStore = tx.objectStore(this.objStoreName);
                return keyValStore.get(index);
            })
    }
}


