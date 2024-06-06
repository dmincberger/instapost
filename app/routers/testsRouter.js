const tests_router = async (req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url.match("\/api\/tests\/first_test")) {
                console.log("DOSTALEM COS");
                res.setHeader("Content-type", "application/json")
                res.write(JSON.stringify([{
                    car_id: 1,
                    car_name: "test_name",
                    car_type: "test_type"
                }]))
                res.end()
            }
    }
}

export default tests_router