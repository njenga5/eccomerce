const parser = (row)=>{
    return {
        image_urls: JSON.parse(row.image_urls),
        color: JSON.parse(row.color),
        size: JSON.parse(row.size),
    }
}

export default parser