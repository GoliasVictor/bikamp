using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Infrastructure;

[Route("monitor")]
[ApiController]
public class RootController : ControllerBase
{
	private readonly IActionDescriptorCollectionProvider _actionDescriptorCollectionProvider;

	public RootController(IActionDescriptorCollectionProvider actionDescriptorCollectionProvider)
	{
		_actionDescriptorCollectionProvider = actionDescriptorCollectionProvider;
	}

	[HttpGet()]
	public string Get()
	{
		var routes = _actionDescriptorCollectionProvider.ActionDescriptors.Items
			.Where(ad => ad.AttributeRouteInfo != null)
			.Select(ad => {
				var Name = ad.AttributeRouteInfo?.Template;
				var Method = ad.ActionConstraints?
								.OfType<HttpMethodActionConstraint>()
								.FirstOrDefault()?.HttpMethods.First()!;
				return Method + " " + Name;
			})
			.ToList();

		return string.Join("\n", routes);
	}
}

 