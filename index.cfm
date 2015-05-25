<cfscript>
	
	thread_local_page_context = CreateObject(
		'java',
		'lucee.runtime.engine.ThreadLocalPageContext'
	);

	page_config = thread_local_page_context.getConfig();
	
	gateway_engine = CreateObject( 
		'java', 
		'lucee.runtime.gateway.GatewayEngineImpl' 
	).init(
		page_config
	);
	
	gateway_config = CreateObject( 
		'java',
		'java.util.HashMap'
	).init(
	);

	gateway_uninitialised = CreateObjecT( 
		'java', 
		'lucee.runtime.gateway.SocketGateway' 
	);

	writedump( gateway_engine );
	writedump( gateway_uninitialised );

	label = 'hobobot';
	cfc_name = 'hobobot';

	writedump( isInstanceOf( gateway_engine , 'lucee.runtime.gateway.GatewayEnginePro' ) );
	writedump( isInstanceOf( label , 'java.lang.String' ) );
	writedump( isInstanceOf( cfc_name , 'java.lang.String' ) );
	writedump( isInstanceOf( gateway_config , 'java.util.Map' ) );

	gateway = gateway_uninitialised.init(
		gateway_engine,
		label,
		cfc_name,
		gateway_config
	);
	writedump( gateway );

	writedump( gateway.getState() );

	writedump( gateway.getState() );
	


</cfscript>