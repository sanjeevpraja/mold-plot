<?php
if(!function_exists('mold_minmax_price')) {
	function mold_minmax_price($type){
		global $wpdb;
		$results = $wpdb->get_results( "SELECT IF(meta_value IS NULL or meta_value = '', '', meta_value) as price
			FROM $wpdb->postmeta WHERE meta_key='_sale_price' OR meta_key='_regular_price'", OBJECT );
		$price_array = array();
		foreach($results as $key => $values)
		{
			$price_array[$key] = $values->price;
		}

		if($type == 'min'){
			$price = array_filter($price_array);
			if(!empty($price)){
				$min = min($price);
			}
			else{
				$min = 0;
			}
			return $min;
		}
		else if($type == 'max'){
			$price = array_filter($price_array);
			if(!empty($price)){
				$max = max($price);
			}
			else{
				$max = 1000;
			}
			return $max;
		}
	}
}