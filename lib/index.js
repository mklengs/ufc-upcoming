
const cheerio = require(cheerio);
const request = require(request);

//Get first 3 upcoming events from sherdog
module.exports.getUpcomingFights = function(callback){

    let events = [];

    //first
    //Getting first 3 upcoming events
    request('https://www.sherdog.com/organizations/Ultimate-Fighting-Championship-UFC-2',function(error,response,html){
        if(!error && response.statusCode == 200){
            let $ = cheerio.load(html);

            $('#upcoming_tab').filter(function(){
                
                for(let i = 2;i<5;i++){
                    
                    let el = $(this).find(`tr:nth-child(${i})`);

                    date = el.find('td:nth-child(1) span');
                    day = date.find('.day').text();
                    month = date.find('.month').text();
                    year = date.find('.year').text();

                    url = el.find('td:nth-child(1) a').attr('href');
                    title = el.find('td:nth-child(2) a span').text();

                    let event = {
                        url: url,
                        title: title,
                        day: day,
                        month: month,
                        year: year,
                        fights: []
                    };

                    events.push(event);
                }
                callback(events) = await getEventFighters();
            })
        }
    })

    //second
    let getEventFighters = async function(){
        for(let i = 0;i<3;i++){
            request(events[i].url,function(error,response,html){
                if(!error && response.statusCode == 200){
                    let $ = cheerio.load(html);

                    let match = {fighter1:"",fighter2:""};

                    $('.fight').filter(function(){
                        el = $(this);
                        match.fighter1 = el.find('.fighter .left_side h3 a span').text();
                        match.fighter2 = el.find('.fighter .right_side h3 a span').text();
                        events[i].fights.push(match);
                    })

                    $('.module.event_match tr:not(.table_head)').each(function(){
                        el = $(this);

                        match.fighter1 = el.find('.text_right.col_fc_upcoming .fighter_result_data a span').text();
                        match.fighter2 = el.find('.text_left.col_fc_upcoming .fighter_result_data a span').text();

                        events[i].fights.push(match);
                    })
                }
            })
        }
    }

}
