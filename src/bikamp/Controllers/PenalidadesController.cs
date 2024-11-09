using Microsoft.AspNetCore.Mvc;

namespace bikamp.Controllers;



[ApiController]
[Route("penalidades/")]

public class PenalidaesController : ControllerBase
{
    private readonly MySqlConnection _conn;

    public PenalidaesController(MySqlConnection conn)
    {
        _conn = conn;
    }

    [HttpPost("")]
    public async Task<ActionResult<int>> Post(Penalidade penalidade) {
        return 0;
    }

}
