import mosuhaSensor from "../models/sensorData.js";

export const getData = async (req, res) => {
    let limit = parseInt(req.query.limit)
    const id = req.query.id;
    try {
        const data = await mosuhaSensor.findAll({
            limit: (limit)? limit : 1, 
            order: [["id", "DESC"]]
        })
        res.json(data);
    } catch (error) {
        console.log(error);
    }
};

export const postData = async (req, res) => {
    return await mosuhaSensor.create({
        temp: req.body.temp,
    }).then(function (mosuhaSensor) {
        if (mosuhaSensor) {
            res.send(mosuhaSensor);
        } else {
            res.status(400).send('Error in insert new record');
        }
    });
}

export const deleteData = async (req, res) => {
    return await mosuhaSensor.destroy({
        where: {},
        truncate: true
    }).then(err => {
        if (err) {
            res.status(400).send("delete failed")
        } else {
            res.status(200).send("delete succes")
        }
      })
}


