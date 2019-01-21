const fs = require("fs");
const csv = require("csv-parser");
const ObjectsToCsv  = require("objects-to-csv");
const _ = require("lodash");

let dataArray = [];
let results = [];

fs.createReadStream("./test.csv")
  .pipe(csv())
  .on("headers", headers => {
    this.headers = headers;
  })
  .on("data", row => {
    //perform the operation
    let existingContact = _.find(results, currentContact => {
      //checking if already exist in ditinct-results list
      return (
        row.nom && row.nom.trim() === currentContact.nom &&
        row.adresse && row.adresse.trim() === currentContact.Address &&
        row.ville && row.ville.trim() === currentContact.City
      );
    });

    if (existingContact) {
      fillContactWithData(existingContact, row);
    } else {
      //contact does not exist - create one
      existingContact = {
        nom: row.nom ? row.nom.trim(): '',
        label1: '',
        label2: '',
        label3: '',
        label4: '',
        label5: '',
        Tel1: '',
        Tel2: '',
        Tel3: '',
        Tel4: '',
        Tel5: '',
        Email: '',
        Website: '',
        Address: row.adresse ? row.adresse.trim() : '',
        City: row.ville ? row.ville.trim() : ''
      };
        fillContactWithData(existingContact, row);
        results.push(existingContact);
        this.index = results.length;
        console.log(this.index);
    }

  })
  .on("end", () => {
    // write to file and update csv after manipulations
    (async() => {
      var resultsCsv = new ObjectsToCsv(results);
      // Save to file:
      await resultsCsv.toDisk('./testRes.csv');
     
      // Return the CSV file as string:
      console.log(await resultsCsv.toString());
    })();

  });

function fillContactWithData(existingContact, row) {
  var phoneReg = new RegExp(/^\d+$/);
  var mailReg = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  var websiteReg = new RegExp(
    /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
  );

  if (phoneReg.test(row.contact)) {
      //add country code
      row.contact = '225' + row.contact; 
    //if numbers only - then it's a phone-number
    if (!existingContact.Tel1) {
      existingContact.Tel1 = row.contact;
      existingContact.label1 = row.label;
    } else if (!existingContact.Tel2) {
      existingContact.Tel2 = row.contact;
      existingContact.label2 = row.label;
    } else if (!existingContact.Tel3) {
      existingContact.Tel3 = row.contact;
      existingContact.label3 = row.label;
    } else if (!existingContact.Tel4) {
      existingContact.Tel4 = row.contact;
      existingContact.label4 = row.label;
    } else if (!existingContact.Tel5) {
      existingContact.Tel5 = row.contact;
      existingContact.label5 = row.label;
    }
  } else if (mailReg.test(row.contact)) {
    if (!existingContact.Email) {
      existingContact.Email = row.contact;
    }
  } else if (websiteReg.test(row.contact)) {
    if (!existingContact.Website) {
      existingContact.Website = row.contact;
    }
  }
}
