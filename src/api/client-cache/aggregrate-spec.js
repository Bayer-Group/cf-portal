const chai = require('chai')
const should = chai.should()
const {mergeByKey, filterByKey} = require('./aggregrate')
const aggregrateJson = require('./aggregrate.json').all
const prettyPrint = (jsonObj) => {
  console.info(JSON.stringify(jsonObj, null, 2))
}

describe('aggregrate', function () {
  it('mergesByKey with a alphabetic chars only', (done) => {
    const mergeKey = 'sparta'
    const parentObj = [
      {
        leonidus: 'king',
        [mergeKey]: 'warriors'
      },
      {
        xerces: 'king',
        persia: 'legendary'
      }
    ]
    const childObj = [
      {
        athens: 'greece',
        spartaOld: 'warriors2'
      },
      {
        athens: 'greece',
        [mergeKey]: 'warriors'
      }
    ]
    const mergeResult = mergeByKey(parentObj, childObj, mergeKey)
    prettyPrint(mergeResult)
    should.exist(mergeResult)
    Object.keys(parentObj[0]).length.should.equal(3)
    parentObj[0].athens.should.equal('greece')
    done()
  })

  it('mergesByKey with a alphanumeric chars only', (done) => {
    const mergeKey = 'mergeKey'
    const parentObj = [
      {
        leonidus: 'king',
        [mergeKey]: 'warriors'
      },
      {
        xerces: 'king',
        persia: 'legendary'
      }
    ]
    const childObj = [
      {
        athens: 'greece',
        sparta: 'warriors2'
      },
      {
        athens: 'greece',
        [mergeKey]: 'warriors'
      }
    ]
    const mergeResult = mergeByKey(parentObj, childObj, mergeKey)
    prettyPrint(mergeResult)
    should.exist(mergeResult)
    Object.keys(parentObj[0]).length.should.equal(3)
    parentObj[0].athens.should.equal('greece')
    done()
  })

  it('mergesByKey with dash and alphanumeric chars', (done) => {
    const mergeKey = 'sparta-2'
    const parentObj = [
      {
        leonidus: 'king',
        [mergeKey]: 'warriors'
      },
      {
        xerces: 'king',
        persia: 'legendary'
      }
    ]
    const childObj = [
      {
        athens: 'greece',
        sparta: 'warriors2'
      },
      {
        athens: 'greece',
        [mergeKey]: 'warriors'
      }
    ]
    const mergeResult = mergeByKey(parentObj, childObj, mergeKey)
    prettyPrint(mergeResult)
    should.exist(mergeResult)
    Object.keys(parentObj[0]).length.should.equal(3)
    parentObj[0].athens.should.equal('greece')
    done()
  })

  it('mergesByKey with underscore and alphanumeric chars', (done) => {
    const mergeKey = 'sparta_2'
    const parentObj = [
      {
        leonidus: 'king',
        [mergeKey]: 'warriors'
      },
      {
        xerces: 'king',
        persia: 'legendary'
      }
    ]
    const childObj = [
      {
        athens: 'greece',
        sparta: 'warriors2'
      },
      {
        athens: 'greece',
        [mergeKey]: 'warriors'
      }
    ]
    const mergeResult = mergeByKey(parentObj, childObj, mergeKey)
    prettyPrint(mergeResult)
    should.exist(mergeResult)
    Object.keys(parentObj[0]).length.should.equal(3)
    parentObj[0].athens.should.equal('greece')
    done()
  })

  it('filters by app guid', (done) => {
    const result = filterByKey('guid', 'ffbe35d7-d908-456f-94e0-ad959bd3e67d', aggregrateJson)
    result.length.should.equal(1)
    result[0].name.should.equal('simulation-model')
    done()
  })

  it('filters by organization guid', () => {
    const orgGuid = '8745b4a4-9bb0-4759-9527-08082effc9bf'
    const results = filterByKey('organization_guid', orgGuid, aggregrateJson)
    results.length.should.equal(199)
  })

  it('returns an empty array on invalid keys', () => {
    const results = filterByKey('invalidKey', 'irrelevantValue', aggregrateJson)
    results.length.should.equal(0)
  })

  it('returns an empty array on values not found', () => {
    const results = filterByKey('org', 'NotARealOrg', aggregrateJson)
    results.length.should.equal(0)
  })
})
