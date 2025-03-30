app.use((req, res, next)=> {
    const tocken = req.cookies.token;
    if(!token){
        return req.status(401).json({message : "Unauthorized"});
    }

    app.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
        if(err) return res.status(403).json({message : "Invalid Tocken"});
        req.user = decoded;
        next();
    });
});