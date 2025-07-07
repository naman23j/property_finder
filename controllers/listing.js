
const Listing=require("../models/listing");
module.exports.index =async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings});
    
}

module.exports.rendernewListing=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=(async(req,res) =>{
    
      let{id} =req.params;
      const listing =await Listing.findById(id).populate("reviews").populate("owner");
      if(!listing){
          req.flash("error","cannot find that listing");
          return res.redirect("/listings");
      };
      console.log(listing);
      res.render("listings/show.ejs",{listing});
})

module.exports.createListing=async(req,res,next)=>{
   let url=req.file.path;
   let filename=req.file.filename;
    
        const newListing = new Listing(req.body.listing);
        newListing.owner =req.user._id;
        newListing.image={url,filename}
        await newListing.save()
        req.flash("success","successfully created a new listing");
        res.redirect("/listings");
}

module.exports.renderEditListing=async(req,res)=>{
    let {id} = req.params;
    id = id.trim();//imp to trim as id has some space or quote in video code it ids not there ..what will happen if it is not there
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","cannot find that listing");
        return res.redirect("/listings");
    };
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing=async(req,res)=>{
    let {id} = req.params;
   let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file !=="undefined"){
   let url = req.file.path;
   let filename = req.file.filename;
    listing.image = {url,filename};
 
}
await listing.save();
   req.flash("success"," updated new listing");
   res.redirect(`/listings/${id}`);
}

// module.exports.updateListing = async (req, res) => {
//     const { id } = req.params;
//     let listing = await Listing.findById(id);

//     if (!listing) {
//         req.flash("error", "Listing not found");
//         return res.redirect("/listings");
//     }

//     // Update fields from form
//     Object.assign(listing, req.body.listing);

//     // If a new image is uploaded, replace the old one
//     if (req.file) {
//         listing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//     }

//     // If no new image uploaded AND no previous image exists
//     if (!req.file && !listing.image?.url) {
//         req.flash("error", "Image is required.");
//         return res.redirect(`/listings/${id}/edit`);
//     }

//     await listing.save();
//     req.flash("success", "Listing updated successfully!");
//     res.redirect(`/listings/${listing._id}`);
// };



module.exports.destroyListing=async(req,res)=>{
    let {id} =req.params;
    let deleteditems = await Listing.findByIdAndDelete(id);
    console.log(deleteditems);
    req.flash("success","successfully deleted a new listing");
    res.redirect("/listings");
}